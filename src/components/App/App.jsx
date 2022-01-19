import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from '../ContactForm';
import Filter from '../Filter';
import ContactList from '../ContactList';
import { Container } from './App.styled';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  addContactInfo = personData => {
    const { name, number } = personData;
    const normalizedNameContact = name.toLowerCase();
    const person = {
      id: nanoid(),
      name: name,
      number: number,
    };

    this.findContactName(normalizedNameContact)
      ? alert(`${name} is already in contacts`)
      : this.setState(prevState => ({
          contacts: [...prevState.contacts, person],
        }));
  };

  findContactName = newNameData => {
    const { contacts } = this.state;
    return contacts.find(({ name }) => name.toLowerCase() === newNameData);
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts.length !== prevState.contacts.length) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { contacts, filter } = this.state;

    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.addContactInfo} />

        {contacts.length > 0 && (
          <>
            <h2>Contacts</h2>

            <Filter value={filter} onChange={this.changeFilter} />
            <ContactList
              visibleContacts={this.getVisibleContacts()}
              onDeleteContact={this.deleteContact}
            />
          </>
        )}
      </Container>
    );
  }
}

export default App;
